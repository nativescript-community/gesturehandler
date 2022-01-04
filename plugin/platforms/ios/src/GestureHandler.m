#import "GestureHandler.h"

#import "NativeViewHandler.h"

#import <UIKit/UIGestureRecognizerSubclass.h>


@interface UIGestureRecognizer (GestureHandler)
@property (nonatomic, readonly) GestureHandler *gestureHandler;
@end


@implementation UIGestureRecognizer (GestureHandler)

- (GestureHandler *)gestureHandler
{
    id delegate = self.delegate;
    if ([delegate isKindOfClass:[GestureHandler class]]) {
        return (GestureHandler *)delegate;
    }
    return nil;
}

@end

typedef struct GHHitSlop {
    CGFloat top, left, bottom, right, width, height;
} RNGHHitSlop;

static RNGHHitSlop RNGHHitSlopEmpty = { NAN, NAN, NAN, NAN, NAN, NAN };

#define GH_HIT_SLOP_GET(key) (prop[key] == nil ? NAN : [prop[key] doubleValue])
#define GH_HIT_SLOP_IS_SET(hitSlop) (!isnan(hitSlop.left) || !isnan(hitSlop.right) || \
                                        !isnan(hitSlop.top) || !isnan(hitSlop.bottom))
#define GH_HIT_SLOP_INSET(key) (isnan(hitSlop.key) ? 0. : hitSlop.key)

CGRect GHHitSlopInsetRect(CGRect rect, RNGHHitSlop hitSlop) {
    rect.origin.x -= GH_HIT_SLOP_INSET(left);
    rect.origin.y -= GH_HIT_SLOP_INSET(top);

    if (!isnan(hitSlop.width)) {
        if (!isnan(hitSlop.right)) {
            rect.origin.x = rect.size.width - hitSlop.width + GH_HIT_SLOP_INSET(right);
        }
        rect.size.width = hitSlop.width;
    } else {
        rect.size.width += (GH_HIT_SLOP_INSET(left) + GH_HIT_SLOP_INSET(right));
    }
    if (!isnan(hitSlop.height)) {
        if (!isnan(hitSlop.bottom)) {
            rect.origin.y = rect.size.height - hitSlop.height + GH_HIT_SLOP_INSET(bottom);
        }
        rect.size.height = hitSlop.height;
    } else {
        rect.size.height += (GH_HIT_SLOP_INSET(top) + GH_HIT_SLOP_INSET(bottom));
    }
    return rect;
}


@implementation GestureHandler {
    NSArray<NSNumber *> *_handlersToWaitFor;
    NSArray<NSNumber *> *_simultaneousHandlers;
    RNGHHitSlop _hitSlop;
}

- (instancetype)initWithTag:(NSNumber *)tag
{
    if ((self = [super init])) {
        _tag = tag;
        _lastState = GestureHandlerStateUndetermined;
        _hitSlop = RNGHHitSlopEmpty;
    }
    return self;
}

- (void)configure:(NSDictionary *)config
{
    _handlersToWaitFor = config[@"waitFor"];
    _simultaneousHandlers = config[@"simultaneousHandlers"];

    id prop = config[@"enabled"];
    if (prop != nil) {
        self.enabled = [prop boolValue];
    } else {
        self.enabled = YES;
    }

    prop = config[@"shouldCancelWhenOutside"];
    if (prop != nil) {
        _shouldCancelWhenOutside = [prop boolValue];
    // } else {
        // _shouldCancelWhenOutside = NO;
    }

    prop = config[@"hitSlop"];
    if ([prop isKindOfClass:[NSNumber class]]) {
        _hitSlop.left = _hitSlop.right = _hitSlop.top = _hitSlop.bottom = [prop doubleValue];
    } else if (prop != nil) {
        _hitSlop.left = _hitSlop.right = GH_HIT_SLOP_GET(@"horizontal");
        _hitSlop.top = _hitSlop.bottom = GH_HIT_SLOP_GET(@"vertical");
        _hitSlop.left = GH_HIT_SLOP_GET(@"left");
        _hitSlop.right = GH_HIT_SLOP_GET(@"right");
        _hitSlop.top = GH_HIT_SLOP_GET(@"top");
        _hitSlop.bottom = GH_HIT_SLOP_GET(@"bottom");
        _hitSlop.width = GH_HIT_SLOP_GET(@"width");
        _hitSlop.height = GH_HIT_SLOP_GET(@"height");
        if (isnan(_hitSlop.left) && isnan(_hitSlop.right) && !isnan(_hitSlop.width)) {
            NSLog(@"When width is set one of left or right pads need to be defined");
        }
        if (!isnan(_hitSlop.width) && !isnan(_hitSlop.left) && !isnan(_hitSlop.right)) {
            NSLog(@"Cannot have all of left, right and width defined");
        }
        if (isnan(_hitSlop.top) && isnan(_hitSlop.bottom) && !isnan(_hitSlop.height)) {
            NSLog(@"When height is set one of top or bottom pads need to be defined");
        }
        if (!isnan(_hitSlop.height) && !isnan(_hitSlop.top) && !isnan(_hitSlop.bottom)) {
            NSLog(@"Cannot have all of top, bottom and height defined");
        }
    }
}

- (void)setEnabled:(BOOL)enabled
{
    _enabled = enabled;
    self.recognizer.enabled = enabled;
}
- (BOOL)enabled
{
    return _enabled;
}

- (void)bindToView:(UIView *)view
{
    // view.userInteractionEnabled = YES;
    self.recognizer.delegate = self;
    [view addGestureRecognizer:self.recognizer];
}

- (void)unbindFromView
{
    [self.recognizer.view removeGestureRecognizer:self.recognizer];
    self.recognizer.delegate = nil;
}

- (NSMutableDictionary *)eventExtraData:(UIGestureRecognizer *)recognizer
{
  CGPoint position = [recognizer locationInView:recognizer.view];
  CGPoint absolutePosition = [recognizer locationInView:recognizer.view.window];
  NSMutableDictionary* result = [NSMutableDictionary new];
  NSUInteger numberOfTouches = recognizer.numberOfTouches;
  [result setObject:@(numberOfTouches) forKey:@"numberOfPointers"];
  [result setObject:@(position.x) forKey:@"x"];
  [result setObject:@(position.y) forKey:@"y"];
  [result setObject:@(absolutePosition.y) forKey:@"absoluteX"];
  [result setObject:@(absolutePosition.y) forKey:@"absoluteY"];
  NSMutableArray* positions = [NSMutableArray arrayWithCapacity:2*numberOfTouches];
  for (NSUInteger i = 0; i <numberOfTouches; i++) {
    CGPoint pos = [recognizer locationOfTouch:i inView:recognizer.view];

    [positions insertObject:@(pos.x) atIndex:2*i];
    [positions insertObject:@(pos.y) atIndex:2*i+1];
  }
  [result setObject:positions forKey:@"positions"];
  return result;
}

- (void)handleGesture:(UIGestureRecognizer *)recognizer
{
    NSMutableDictionary *eventData = [self eventExtraData:recognizer];
  [self sendEventsInState:[self stateForRecognizer:recognizer] forView:recognizer.view withExtraData:eventData];
}

- (void)sendEventsInState:(GestureHandlerState)state
           forView:(nonnull UIView *)view
            withExtraData:(nullable NSDictionary *)extraData
{
    if (state != _lastState) {
        if (state == GestureHandlerStateEnd && _lastState != GestureHandlerStateActive) {
          if (self.delegate) {
            [self.delegate gestureHandler:self didChangeState:GestureHandlerStateActive prevState:_lastState extraData:extraData view:view];
          }
            _lastState = GestureHandlerStateActive;
        }
        if (self.delegate) {
          [self.delegate gestureHandler:self didChangeState:state prevState:_lastState extraData:extraData view:view];
        }
        _lastState = state;
    }

    if (state == GestureHandlerStateActive) {
      if (self.delegate) {
        [self.delegate gestureHandler:self touchEventOnView:view state:state extraData:extraData];
      }
    }
}

- (GestureHandlerState)state
{
    switch (_recognizer.state) {
        case UIGestureRecognizerStateBegan:
        case UIGestureRecognizerStatePossible:
            return GestureHandlerStateBegan;
        case UIGestureRecognizerStateEnded:
            return GestureHandlerStateEnd;
        case UIGestureRecognizerStateFailed:
            return GestureHandlerStateFailed;
        case UIGestureRecognizerStateCancelled:
            return GestureHandlerStateCancelled;
        case UIGestureRecognizerStateChanged:
            return GestureHandlerStateActive;
    }
    return GestureHandlerStateUndetermined;
}
- (GestureHandlerState)stateForRecognizer:(UIGestureRecognizer*)recognizer
{
    switch (recognizer.state) {
        case UIGestureRecognizerStateBegan:
        case UIGestureRecognizerStatePossible:
            return GestureHandlerStateBegan;
        case UIGestureRecognizerStateEnded:
            return GestureHandlerStateEnd;
        case UIGestureRecognizerStateFailed:
            return GestureHandlerStateFailed;
        case UIGestureRecognizerStateCancelled:
            return GestureHandlerStateCancelled;
        case UIGestureRecognizerStateChanged:
            return GestureHandlerStateActive;
    }
    return GestureHandlerStateUndetermined;
}

#pragma mark UIGestureRecognizerDelegate

+ (GestureHandler *)findGestureHandlerByRecognizer:(UIGestureRecognizer *)recognizer
{
    GestureHandler *handler = recognizer.gestureHandler;
    if (handler != nil) {
        return handler;
    }

    // We may try to extract "DummyGestureHandler" in case when "otherGestureRecognizer" belongs to
    // a native view being wrapped with "NativeViewGestureHandler"
    UIView *view = recognizer.view;
//    while (reactView != nil && reactView.reactTag == nil) {
//        reactView = reactView.superview;
//    }

    for (UIGestureRecognizer *recognizer in view.gestureRecognizers) {
        if ([recognizer isKindOfClass:[DummyGestureRecognizer class]]) {
            return recognizer.gestureHandler;
        }
    }

    return nil;
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer
shouldBeRequiredToFailByGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer
{
    GestureHandler *handler = [GestureHandler findGestureHandlerByRecognizer:otherGestureRecognizer];
    if ([handler isKindOfClass:[NativeViewGestureHandler class]]) {
        for (NSNumber *handlerTag in handler->_handlersToWaitFor) {
            if ([_tag isEqual:handlerTag]) {
                return YES;
            }
        }
    }

    return NO;
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer
shouldRequireFailureOfGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer
{
    if ([_handlersToWaitFor count]) {
        GestureHandler *handler = [GestureHandler findGestureHandlerByRecognizer:otherGestureRecognizer];
        if (handler != nil) {
            for (NSNumber *handlerTag in _handlersToWaitFor) {
                if ([handler.tag isEqual:handlerTag]) {
                    return YES;
                }
            }
        }
    }
    return NO;
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer
shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer
{
   if (gestureRecognizer.view == otherGestureRecognizer.view && [gestureRecognizer isKindOfClass:[UISwipeGestureRecognizer class]]  && [otherGestureRecognizer isKindOfClass:[UISwipeGestureRecognizer class]]) {
      return YES;
    }
    if (_recognizer.state == UIGestureRecognizerStateBegan && _recognizer.state == UIGestureRecognizerStatePossible) {
        return YES;
    }
    if ([_simultaneousHandlers count]) {
        GestureHandler *handler = [GestureHandler findGestureHandlerByRecognizer:otherGestureRecognizer];
        if (handler != nil) {
            for (NSNumber *handlerTag in _simultaneousHandlers) {
                if ([handler.tag isEqual:handlerTag]) {
                    return YES;
                }
            }
        }
    }
    return NO;
}

- (void)reset
{
    _lastState = GestureHandlerStateUndetermined;
}

 - (BOOL)containsPointInView
 {
     CGPoint pt = [_recognizer locationInView:_recognizer.view];
     CGRect hitFrame = GHHitSlopInsetRect(_recognizer.view.bounds, _hitSlop);
     return CGRectContainsPoint(hitFrame, pt);
 }

- (BOOL)gestureRecognizerShouldBegin:(UIGestureRecognizer *)gestureRecognizer
{
    [self reset];
    if (self.delegate && [self.delegate respondsToSelector:@selector(gestureHandler:shouldActivateForEvent:)]) {
        if (![self.delegate gestureHandler:self shouldActivateForEvent:[self eventExtraData:gestureRecognizer]]) {
          return FALSE;
        }
    }
    return YES;
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldReceiveTouch:(UITouch *)touch
{
#if TARGET_IPHONE_SIMULATOR
    // we get unwanted touch on simulator which messes everything
    UIView* view = gestureRecognizer.view;
    CGPoint location = [touch locationInView:gestureRecognizer.view];
    if (touch.phase == UITouchPhaseBegan && location.x == 0 && round(location.y) == view.window.bounds.size.height) {
        return NO;
    }
#endif // TARGET_IPHONE_SIMULATOR

    // If hitSlop is set we use it to determine if a given gesture recognizer should start processing
    // touch stream. This only works for negative values of hitSlop as this method won't be triggered
    // unless touch startes in the bounds of the attached view. To acheve similar effect with positive
    // values of hitSlop one should set hitSlop for the underlying view. This limitation is due to the
    // fact that hitTest method is only available at the level of UIView
    if (GH_HIT_SLOP_IS_SET(_hitSlop)) {
        CGPoint location = [touch locationInView:gestureRecognizer.view];
        CGRect hitFrame = GHHitSlopInsetRect(gestureRecognizer.view.bounds, _hitSlop);
        return CGRectContainsPoint(hitFrame, location);
    }
    return YES;
}

//- (void)sendTouchEvent:(GestureHandlerEvent *)event
//{
//  //    [_eventDispatcher sendEvent:event];
//}
//
//- (void)sendStateChangeEvent:(GestureHandlerStateChange *)event
//{
//  //    [_eventDispatcher sendEvent:event];
//}


@end
